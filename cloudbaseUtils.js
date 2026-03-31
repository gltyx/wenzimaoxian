// 腾讯云 CloudBase 工具模块兼容层
// 此文件保留仅作为兼容层，防止代码错误

const cloudbaseUtils = {
  // 所有功能已在 tencent-cloud-config.js 中实现
  // 此文件仅作为兼容层，防止代码错误
};

// 暴露给全局
if (typeof window !== 'undefined') {
  // 只有在 tencent-cloud-config.js 未定义时才使用此默认对象
  window.cloudbaseUtils = window.cloudbaseUtils || cloudbaseUtils;
}