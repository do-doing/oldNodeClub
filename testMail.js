const nodemailer = require("nodemailer")

// 创建传输器（含安全配置）
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com", // QQ邮箱SMTP服务器[1,6](@ref)
  port: 465, // SSL加密端口[6](@ref)
  secure: true, // 强制SSL加密[6](@ref)
  auth: {
    user: "751276089@qq.com",
    pass: "fixcfrvprblvbcdf",
  },
  tls: {
    rejectUnauthorized: false, // 规避证书验证问题[6](@ref)
  },
})
async function sendEmail(to, subject, content) {
  try {
    const info = await transporter.sendMail({
      from: "751276089@qq.com", // 带名称的发件人[5](@ref)
      to, // 收件人（支持数组）
      subject: "邮件主题-test send email", // 邮件主题
      text: "纯文本内容" || "", // 纯文本内容[2](@ref)
      html: "HTML内容" || "", // HTML内容[5](@ref)
    })

    console.log(`邮件已发送至 ${to}，MessageID: ${info.messageId}`)
    return info
  } catch (error) {
    console.error("邮件发送失败:", error)
    throw new Error(`邮件发送失败: ${error.message}`)
  }
}

sendEmail("tobejane@163.com")