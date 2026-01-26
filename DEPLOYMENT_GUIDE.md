# 域名部署指南 - rriwen4x.me

本指南将帮助你将项目部署到阿里云万网购买的域名 `rriwen4x.me`。

## 推荐方案：使用 Vercel 部署（最简单）

### 为什么选择 Vercel？
- ✅ 项目已配置 Vercel（有 `vercel.json`）
- ✅ 免费且性能优秀
- ✅ 自动 HTTPS 证书
- ✅ 支持自定义域名
- ✅ 自动部署（GitHub 推送后自动部署）

### 部署步骤

#### 1. 在 Vercel 上部署项目

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录（推荐，可以自动关联仓库）

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库 `rriwen/4xOS`
   - Vercel 会自动检测到 `vercel.json` 配置
   - 点击 "Deploy" 开始部署

3. **等待部署完成**
   - 首次部署可能需要 2-3 分钟
   - 部署完成后会获得一个临时域名（如：`4xos-xxx.vercel.app`）

#### 2. 配置自定义域名

1. **在 Vercel 中添加域名**
   - 进入项目 Dashboard
   - 点击顶部 "Settings" 标签
   - 在左侧菜单选择 "Domains"
   - 在输入框中添加：`rriwen4x.me`
   - 点击 "Add"

2. **配置 DNS 记录（在阿里云万网）**
   
   Vercel 会显示需要添加的 DNS 记录，通常是：
   
   **选项 A：使用 A 记录（推荐）**
   ```
   类型: A
   主机记录: @
   记录值: 76.76.21.21 (Vercel 提供的 IP)
   TTL: 600
   ```
   
   **选项 B：使用 CNAME 记录**
   ```
   类型: CNAME
   主机记录: @
   记录值: cname.vercel-dns.com
   TTL: 600
   ```
   
   **同时添加 www 子域名（可选）：**
   ```
   类型: CNAME
   主机记录: www
   记录值: cname.vercel-dns.com
   TTL: 600
   ```

3. **在阿里云万网配置 DNS**
   - 登录阿里云控制台
   - 进入 "域名" → "解析设置"
   - 找到 `rriwen4x.me` 域名
   - 添加上述 DNS 记录
   - 保存配置

4. **等待 DNS 生效**
   - DNS 记录通常需要 10 分钟到 24 小时生效
   - 可以使用 `nslookup rriwen4x.me` 或在线工具检查 DNS 是否生效

5. **验证域名**
   - 回到 Vercel 的 Domains 页面
   - 等待域名状态变为 "Valid"
   - Vercel 会自动配置 HTTPS 证书

#### 3. 完成部署

- 访问 https://rriwen4x.me 查看你的网站
- 如果配置了 www，https://www.rriwen4x.me 也会自动跳转

---

## 备选方案：GitHub Pages

如果你更倾向于使用 GitHub Pages，也可以按以下步骤操作：

### 使用 GitHub Pages 部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **配置 GitHub Pages**
   - 在 GitHub 仓库设置中启用 Pages
   - Source 选择 `gh-pages` 分支或 `main` 分支的 `/docs` 文件夹

3. **配置域名**
   - 在仓库根目录创建或更新 `CNAME` 文件（已存在）
   - 内容为：`rriwen4x.me`
   - 在 GitHub Pages 设置中添加自定义域名

4. **配置 DNS**
   - 在阿里云万网添加以下 DNS 记录：
   ```
   类型: CNAME
   主机记录: @
   记录值: rriwen.github.io
   ```

---

## 环境变量配置（如果需要）

如果你的项目需要环境变量（如 DeepSeek API Key），请参考 `VERCEL_ENV_SETUP.md` 文件。

---

## 常见问题

### DNS 不生效？
- 检查 DNS 记录是否正确
- 等待更长时间（最多 24 小时）
- 清除本地 DNS 缓存：`sudo dscacheutil -flushcache` (macOS)

### HTTPS 证书问题？
- Vercel 会自动配置，等待几分钟即可
- 确保 DNS 记录已正确配置

### 如何更新网站？
- 推送代码到 GitHub，Vercel 会自动重新部署
- 或在 Vercel Dashboard 手动触发重新部署

---

## 需要帮助？

如果遇到问题，请提供：
1. 具体的错误信息
2. DNS 配置截图
3. Vercel 部署日志
