# Vercel 部署步骤 - 快速指南

## 第一步：在 Vercel 上部署项目

### 方法 A：通过网页界面（推荐，最简单）

1. **访问 Vercel**
   - 打开浏览器，访问：https://vercel.com
   - 点击右上角 "Sign Up" 或 "Log In"
   - **推荐使用 GitHub 账号登录**（这样可以直接关联你的仓库）

2. **导入项目**
   - 登录后，点击 "Add New..." → "Project"
   - 在 "Import Git Repository" 中，选择你的 GitHub 账号
   - 找到并选择仓库：`rriwen/4xOS`
   - 点击 "Import"

3. **配置项目（通常会自动检测）**
   - Vercel 会自动检测到 `vercel.json` 配置文件
   - Framework Preset: Vite（自动检测）
   - Build Command: `npm run build`（自动检测）
   - Output Directory: `dist`（自动检测）
   - 其他设置保持默认即可

4. **环境变量（如果需要）**
   - 如果你有 DeepSeek API Key，可以在这一步添加
   - 点击 "Environment Variables"
   - 添加：`VITE_DEEPSEEK_API_KEY` = 你的 API Key
   - 选择环境：Production, Preview, Development（全选）

5. **开始部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟，部署会自动完成
   - 部署完成后，你会看到一个临时域名（如：`4xos-xxx.vercel.app`）

---

## 第二步：配置自定义域名 rriwen4x.me

### 1. 在 Vercel 中添加域名

1. 进入项目 Dashboard（部署完成后会自动跳转）
2. 点击顶部导航栏的 **"Settings"** 标签
3. 在左侧菜单中找到并点击 **"Domains"**
4. 在 "Add Domain" 输入框中输入：`rriwen4x.me`
5. 点击 **"Add"** 按钮

### 2. 查看 DNS 配置要求

Vercel 会显示需要配置的 DNS 记录，通常有两种方式：

**方式一：使用 CNAME 记录（推荐，更灵活）**
```
类型: CNAME
主机记录: @
记录值: cname.vercel-dns.com
TTL: 600 或 自动
```

**方式二：使用 A 记录**
```
类型: A
主机记录: @
记录值: 76.76.21.21（Vercel 提供的 IP 地址）
TTL: 600 或 自动
```

**同时添加 www 子域名（可选，推荐）：**
```
类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
TTL: 600 或 自动
```

### 3. 在阿里云万网配置 DNS

1. **登录阿里云控制台**
   - 访问：https://dc.console.aliyun.com
   - 使用你的阿里云账号登录

2. **进入域名解析**
   - 在控制台搜索 "域名" 或 "DNS"
   - 点击 "域名" → "域名解析"
   - 找到你的域名 `rriwen4x.me`

3. **添加 DNS 记录**
   - 点击 "添加记录"
   - 按照 Vercel 显示的配置添加记录：
     - **主机记录**：`@`（表示根域名）
     - **记录类型**：选择 `CNAME` 或 `A`（根据 Vercel 的提示）
     - **记录值**：输入 Vercel 提供的值（如 `cname.vercel-dns.com` 或 IP 地址）
     - **TTL**：600 或默认值
   - 点击 "确认" 保存

4. **添加 www 子域名（可选）**
   - 再次点击 "添加记录"
   - **主机记录**：`www`
   - **记录类型**：`CNAME`
   - **记录值**：`cname.vercel-dns.com`
   - 点击 "确认" 保存

### 4. 等待 DNS 生效

- DNS 记录通常需要 **10 分钟到 24 小时** 才能完全生效
- 可以使用以下命令检查 DNS 是否生效：
  ```bash
  # macOS/Linux
  nslookup rriwen4x.me
  
  # 或使用 dig
  dig rriwen4x.me
  ```
- 也可以使用在线工具：https://dnschecker.org

### 5. 验证域名配置

1. 回到 Vercel 的 "Domains" 页面
2. 等待域名状态从 "Pending" 变为 **"Valid"**
3. Vercel 会自动为你的域名配置 **HTTPS 证书**（Let's Encrypt）
4. 这个过程可能需要几分钟到几小时

---

## 第三步：完成！

一旦 DNS 生效且 Vercel 验证通过，你就可以访问：

- ✅ https://rriwen4x.me
- ✅ https://www.rriwen4x.me（如果配置了）

---

## 后续更新

以后每次你推送代码到 GitHub，Vercel 都会自动重新部署你的网站！

```bash
git add .
git commit -m "更新内容"
git push
```

---

## 常见问题

### Q: DNS 一直不生效？
- 检查 DNS 记录是否正确
- 清除本地 DNS 缓存：`sudo dscacheutil -flushcache` (macOS)
- 等待更长时间（最多 24 小时）

### Q: Vercel 显示域名验证失败？
- 确保 DNS 记录已正确添加
- 等待 DNS 完全生效后再检查
- 检查域名是否在其他地方被使用

### Q: 如何查看部署日志？
- 在 Vercel Dashboard 中点击 "Deployments"
- 选择任意一次部署，查看详细日志

### Q: 需要配置环境变量？
- 参考 `VERCEL_ENV_SETUP.md` 文件

---

## 需要帮助？

如果遇到问题，请提供：
1. Vercel 部署日志截图
2. 阿里云 DNS 配置截图
3. 具体的错误信息
