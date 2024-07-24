import { fabric } from 'fabric';

fabric.Image.filters.RemoveGreen = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends fabric.Image.filters.RemoveGreen.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'RemoveGreen',

  /**
   * Color to remove, in any format understood by fabric.Color.
   * @param {String} type
   * @default
   */
  color: '#00FF00',

  /**
   * Fragment source for the brightness program
   */
  fragmentSource: `precision highp float;
varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec3 keyColor;

// 色度的相似度计算
uniform float similarity;
// 透明度的平滑度计算
uniform float smoothness;
// 降低绿幕饱和度，提高抠图准确度
uniform float spill;

vec2 RGBtoUV(vec3 rgb) {
  return vec2(
    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
  );
}

void main() {
  // 获取当前像素的rgba值
  vec4 rgba = texture2D(uTexture, vTexCoord);
  // 计算当前像素与绿幕像素的色度差值
  vec2 chromaVec = RGBtoUV(rgba.rgb) - RGBtoUV(keyColor);
  // 计算当前像素与绿幕像素的色度距离（向量长度）, 越相像则色度距离越小
  float chromaDist = sqrt(dot(chromaVec, chromaVec));
  // 设置了一个相似度阈值，baseMask为负，则表明是绿幕，为正则表明不是绿幕
  float baseMask = chromaDist - similarity;
  // 如果baseMask为负数，fullMask等于0；baseMask为正数，越大，则透明度越低
  float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);
  rgba.a = fullMask; // 设置透明度
  // 如果baseMask为负数，spillVal等于0；baseMask为整数，越小，饱和度越低
  float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
  float desat = clamp(rgba.r * 0.2126 + rgba.g * 0.7152 + rgba.b * 0.0722, 0., 1.); // 计算当前像素的灰度值
  rgba.rgb = mix(vec3(desat, desat, desat), rgba.rgb, spillVal);
  gl_FragColor = rgba;
}
`,
  similarity: 0.02,
  smoothness: 0.02,
  spill: 0.02,

  /**
   * distance to actual color, as value up or down from each r,g,b
   * between 0 and 1
   **/
  distance: 0.02,

  /**
   * For color to remove inside distance, use alpha channel for a smoother deletion
   * NOT IMPLEMENTED YET
   **/
  useAlpha: false,

  /**
   * Constructor
   * @memberOf fabric.Image.filters.RemoveWhite.prototype
   * @param {Object} [options] Options object
   * @param {Number} [options.color=#RRGGBB] Threshold value
   * @param {Number} [options.distance=10] Distance value
   */

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo2d: function(options) {
    var imageData = options.imageData,
        data = imageData.data, i,
        distance = this.distance * 255,
        r, g, b,
        source = new fabric.Color(this.color).getSource(),
        lowC = [
          source[0] - distance,
          source[1] - distance,
          source[2] - distance,
        ],
        highC = [
          source[0] + distance,
          source[1] + distance,
          source[2] + distance,
        ];


    for (i = 0; i < data.length; i += 4) {
      r = data[i];
      g = data[i + 1];
      b = data[i + 2];

      if (r > lowC[0] &&
          g > lowC[1] &&
          b > lowC[2] &&
          r < highC[0] &&
          g < highC[1] &&
          b < highC[2]) {
        data[i + 3] = 0;
      }
    }
  },

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations: function(gl, program) {
    return {
      similarity: gl.getUniformLocation(program, 'similarity'),
      smoothness: gl.getUniformLocation(program, 'smoothness'),
      spill: gl.getUniformLocation(program, 'spill'),
      keyColor: gl.getUniformLocation(program, 'keyColor'),
    };
  },

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData: function(gl, uniformLocations) {
    // var source = new fabric.Color(this.color).getSource(),
    //     distance = parseFloat(this.distance),
    //     lowC = [
    //       0 + source[0] / 255 - distance,
    //       0 + source[1] / 255 - distance,
    //       0 + source[2] / 255 - distance,
    //       1
    //     ],
    //     highC = [
    //       source[0] / 255 + distance,
    //       source[1] / 255 + distance,
    //       source[2] / 255 + distance,
    //       1
    //     ];
    gl.uniform3fv(
      uniformLocations.keyColor,
      (new fabric.Color(this.color).getSource()).slice(0, 3).map((v) => v / 255),
    );
    gl.uniform1f(uniformLocations.similarity, this.similarity);
    gl.uniform1f(uniformLocations.smoothness, this.smoothness);
    gl.uniform1f(uniformLocations.spill, this.spill);
  },

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      color: this.color,
      similarity: this.similarity,
      smoothness: this.smoothness,
      spill: this.spill,
    });
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @param {Function} [callback] to be invoked after filter creation
 * @return {fabric.Image.filters.RemoveGreen} Instance of fabric.Image.filters.RemoveWhite
 */
fabric.Image.filters.RemoveGreen.fromObject = fabric.Image.filters.BaseFilter.fromObject;
