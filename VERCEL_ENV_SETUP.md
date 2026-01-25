# Vercel 环境变量配置指南

## 配置 DeepSeek API Key

### 方法一：通过 Vercel 网站（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com 并登录你的账号

2. **进入项目设置**
   - 在 Dashboard 中找到你的项目（4xOS）
   - 点击项目进入详情页
   - 点击顶部导航栏的 **Settings** 标签

3. **添加环境变量**
   - 在左侧菜单中点击 **Environment Variables**
   - 点击 **Add New** 按钮
   - 填写以下信息：
     - **Key**: `VITE_DEEPSEEK_API_KEY`
     - **Value**: 你的 DeepSeek API Key（从 https://platform.deepseek.com 获取）
     - **Environment**: 选择以下环境（建议全选）：
       - ✅ Production（生产环境）
       - ✅ Preview（预览环境）
       - ✅ Development（开发环境）
   - 点击 **Save** 保存

4. **重新部署**
   - 环境变量添加后，需要重新部署才能生效
   - 方法 1：在 **Deployments** 页面，找到最新的部署，点击右侧的 **...** 菜单，选择 **Redeploy**
   - 方法 2：推送一个新的提交到 GitHub，Vercel 会自动触发部署

### 方法二：通过 Vercel CLI

如果你安装了 Vercel CLI，可以使用命令行添加环境变量：

```bash
# 安装 Vercel CLI（如果还没有安装）
npm i -g vercel

# 登录 Vercel
vercel login

# 添加环境变量
vercel env add VITE_DEEPSEEK_API_KEY production
# 然后输入你的 API Key

# 也可以为其他环境添加
vercel env add VITE_DEEPSEEK_API_KEY preview
vercel env add VITE_DEEPSEEK_API_KEY development
```

### 验证配置

1. 重新部署后，访问你的网站
2. 打开 TalkTo4x 应用
3. 尝试发送一条消息
4. 如果不再显示 "未配置 DeepSeek API Key" 的错误，说明配置成功

### 注意事项

- ⚠️ **安全提示**：不要在代码仓库中提交 API Key
- ✅ `.env` 文件已经在 `.gitignore` 中，不会被提交
- ✅ 环境变量在 Vercel 中是加密存储的
- 🔄 修改环境变量后，必须重新部署才能生效
- 📝 环境变量名称必须以 `VITE_` 开头，Vite 才会在构建时将其注入到客户端代码中

### 获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com
2. 登录或注册账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 API Key（只显示一次，请妥善保存）

### 故障排查

如果配置后仍然报错：

1. **检查环境变量名称**：确保是 `VITE_DEEPSEEK_API_KEY`（注意大小写）
2. **检查环境选择**：确保在正确的环境（Production/Preview/Development）中添加了变量
3. **重新部署**：修改环境变量后必须重新部署
4. **检查构建日志**：在 Vercel 的部署日志中查看是否有错误信息
5. **清除缓存**：如果问题持续，尝试清除浏览器缓存或使用无痕模式访问
