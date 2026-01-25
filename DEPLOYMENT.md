# 部署指南

本文档介绍如何将 4xOS 项目部署到阿里云 OSS（对象存储）并绑定自定义域名。

## 前置准备

### 1. 获取阿里云 AccessKey

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 点击右上角头像，选择「AccessKey 管理」
3. 如果还没有 AccessKey，点击「创建 AccessKey」
4. 安全验证后，系统会生成 AccessKey ID 和 AccessKey Secret
5. **重要**: 请妥善保管 AccessKey Secret，它只会显示一次

> ⚠️ **安全提示**: 
> - 不要将 AccessKey 提交到代码仓库
> - 建议创建子账号并授予最小权限（仅 OSS 相关权限）
> - 定期轮换 AccessKey

### 2. 创建 OSS Bucket

1. 登录 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)
2. 点击「Bucket 列表」-> 「创建 Bucket」
3. 配置 Bucket：
   - **Bucket 名称**: 建议使用 `rriwen4x-me`（必须全局唯一）
   - **区域**: 选择离您最近的区域（如：华东1-杭州）
   - **存储类型**: 选择「标准存储」
   - **读写权限**: 选择「公共读」（静态网站需要）
   - **服务端加密**: 可选
   - **版本控制**: 建议开启（方便回滚）
4. 点击「确定」创建

### 3. 配置 OSS 静态网站托管

1. 在 OSS 控制台，进入您创建的 Bucket
2. 点击左侧「基础设置」-> 「静态网站托管」
3. 点击「设置」
4. 配置：
   - **默认首页**: `index.html`
   - **默认 404 页**: `index.html`（支持 SPA 路由）
5. 点击「保存」

### 4. 配置域名解析（CNAME）

1. 登录 [阿里云域名控制台](https://dc.console.aliyun.com/)
2. 找到您的域名 `rriwen4x.me`，点击「解析设置」
3. 点击「添加记录」
4. 配置解析记录：
   - **记录类型**: 选择「CNAME」
   - **主机记录**: 
     - 如果访问 `www.rriwen4x.me`，填写 `www`
     - 如果访问 `rriwen4x.me`，填写 `@` 或留空
   - **解析路线**: 默认
   - **记录值**: 填写 OSS 的访问域名，格式为 `{bucket-name}.{region}.aliyuncs.com`
     例如：`rriwen4x-me.oss-cn-hangzhou.aliyuncs.com`
   - **TTL**: 默认 10 分钟
5. 点击「确定」

> 💡 **提示**: 
> - 如果同时需要 `www` 和根域名访问，需要添加两条 CNAME 记录
> - 域名解析生效需要几分钟到几小时不等

### 5. 配置 SSL 证书（HTTPS）

#### 方式一：使用阿里云免费 SSL 证书（推荐）

1. 登录 [阿里云 SSL 证书控制台](https://yundun.console.aliyun.com/?p=cas)
2. 点击「免费证书」-> 「立即购买」（免费证书限 20 个）
3. 点击「证书申请」
4. 填写域名信息：
   - **域名**: `rriwen4x.me`（或 `*.rriwen4x.me` 通配符证书）
   - **域名验证方式**: 选择「自动 DNS 验证」（推荐）或「手动 DNS 验证」
5. 提交申请后，等待审核（通常几分钟）
6. 审核通过后，下载证书

#### 方式二：在 OSS 中配置证书

1. 在 OSS 控制台，进入您的 Bucket
2. 点击「传输管理」-> 「域名管理」
3. 点击「绑定用户域名」
4. 输入您的域名 `rriwen4x.me`
5. 上传 SSL 证书（从证书服务下载的证书文件）
6. 点击「提交」

> ⚠️ **注意**: OSS 的静态网站托管不支持直接配置 HTTPS，需要通过 CDN 来实现 HTTPS。

#### 方式三：使用 CDN 配置 HTTPS（推荐）

如果使用 CDN 加速，可以在 CDN 中配置 SSL 证书，详见「配置 CDN 加速」章节。

### 6. 配置 CDN 加速（可选但推荐）

CDN 可以加速网站访问，并支持 HTTPS 配置。

1. 登录 [阿里云 CDN 控制台](https://cdn.console.aliyun.com/)
2. 点击「域名管理」-> 「添加域名」
3. 配置域名：
   - **加速域名**: `rriwen4x.me`
   - **业务类型**: 选择「全站加速」或「静态内容加速」
   - **源站信息**: 
     - **源站类型**: OSS 域名
     - **源站地址**: 选择您的 OSS Bucket（会自动填充）
   - **加速区域**: 根据需求选择
4. 点击「下一步」-> 「提交」
5. 等待 CDN 配置完成（通常几分钟）

#### 在 CDN 中配置 HTTPS

1. 在 CDN 控制台，进入您的加速域名
2. 点击「HTTPS 配置」
3. 点击「修改配置」
4. 开启「HTTPS 安全加速」
5. 上传 SSL 证书（从证书服务下载）
6. 点击「确定」

#### 更新域名解析

配置 CDN 后，需要更新域名解析记录：

1. 在域名控制台，找到您的域名解析记录
2. 将 CNAME 记录值改为 CDN 提供的 CNAME 地址
3. 格式类似：`rriwen4x.me.w.kunlunea.com`

## 本地配置

### 1. 创建环境变量文件

1. 在项目根目录创建 `.env` 文件

2. 编辑 `.env` 文件，填入您的配置信息：
   ```env
   # 阿里云 AccessKey 配置
   ALIYUN_ACCESS_KEY_ID=您的AccessKeyID
   ALIYUN_ACCESS_KEY_SECRET=您的AccessKeySecret

   # OSS Bucket 配置
   ALIYUN_OSS_BUCKET=rriwen4x-me

   # OSS 区域（根据您创建的 Bucket 区域填写）
   ALIYUN_OSS_REGION=oss-cn-hangzhou

   # OSS 访问端点（可选，通常不需要设置）
   # ALIYUN_OSS_ENDPOINT=
   ```

> 💡 **提示**: 常用区域包括：
> - `oss-cn-hangzhou` (华东1-杭州)
> - `oss-cn-shanghai` (华东2-上海)
> - `oss-cn-beijing` (华北2-北京)
> - `oss-cn-shenzhen` (华南1-深圳)

### 2. 安装依赖

```bash
npm install
```

## 部署

### 首次部署

1. 确保已完成上述所有前置准备步骤
2. 运行部署命令：
   ```bash
   npm run deploy
   ```

### 预览部署（不上传）

在实际上传之前，可以先预览将要上传的文件：

```bash
npm run deploy:dry-run
```

### 后续部署

每次代码更新后，只需运行：

```bash
npm run deploy
```

部署脚本会自动：
1. 构建项目（如果 dist 目录不存在）
2. 上传所有文件到 OSS
3. 配置静态网站托管

## 验证部署

部署完成后，可以通过以下方式验证：

1. **OSS 访问地址**: `https://{bucket-name}.{region}.aliyuncs.com`
2. **自定义域名**: `https://rriwen4x.me`（如果已配置）

## 常见问题

### 1. 上传失败：AccessDenied

**原因**: AccessKey 权限不足或 Bucket 权限配置错误

**解决方案**:
- 检查 AccessKey 是否有 OSS 的读写权限
- 检查 Bucket 的读写权限是否为「公共读」

### 2. 域名无法访问

**原因**: 域名解析未生效或配置错误

**解决方案**:
- 检查域名解析记录是否正确
- 使用 `ping` 或 `nslookup` 命令检查解析是否生效
- 等待 DNS 缓存更新（可能需要几小时）

### 3. HTTPS 无法访问

**原因**: SSL 证书未配置或配置错误

**解决方案**:
- 如果使用 OSS 直接访问，OSS 静态网站托管不支持 HTTPS
- 建议使用 CDN 并配置 SSL 证书
- 检查证书是否已正确上传和绑定

### 4. 页面刷新 404

**原因**: SPA 路由需要配置错误页面重定向

**解决方案**:
- 在 OSS 静态网站托管中，将「默认 404 页」设置为 `index.html`
- 如果使用 CDN，需要在 CDN 中配置「回源规则」，将 404 重定向到 `index.html`

### 5. 静态资源加载失败

**原因**: 资源路径配置错误

**解决方案**:
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保资源路径使用相对路径或正确的绝对路径

## 成本估算

- **OSS 存储**: 约 ¥0.12/GB/月
- **OSS 流量**: 约 ¥0.50/GB（外网下行流量）
- **CDN 流量**: 约 ¥0.24/GB（国内流量）
- **SSL 证书**: 免费（DV 证书）

对于小型网站，月成本通常在 ¥10-50 之间。

## 安全建议

1. **使用子账号**: 创建专门的子账号用于部署，授予最小权限
2. **定期轮换密钥**: 建议每 3-6 个月更换一次 AccessKey
3. **启用日志**: 在 OSS 中启用访问日志，监控异常访问
4. **配置防盗链**: 在 OSS 中配置 Referer 白名单，防止资源被盗用
5. **启用 WAF**: 如果使用 CDN，建议启用 Web 应用防火墙

## 相关链接

- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [阿里云 CDN 文档](https://help.aliyun.com/product/27099.html)
- [阿里云 SSL 证书文档](https://help.aliyun.com/product/28537.html)
- [域名解析文档](https://help.aliyun.com/product/29697.html)
