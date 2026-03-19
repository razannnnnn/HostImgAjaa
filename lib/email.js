import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  await resend.emails.send({
    from: "HostImgAjaa <onboarding@resend.dev>",
    to: email,
    subject: "Verifikasi Email Kamu - HostImgAjaa",
    html: `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verifikasi Email - HostImgAjaa</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0e14;font-family:'Segoe UI',Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0c0e14;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <h1 style="margin:0;font-size:24px;font-weight:700;color:#f0f1ff;letter-spacing:-0.5px;">
                                HostImg<span style="color:#7c7fea;">Ajaa</span>
                            </h1>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color:#13151e;border:1px solid #2a2d3e;border-radius:18px;padding:40px 36px;">

                            <!-- Title -->
                            <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#f0f1ff;text-align:center;">
                                Verifikasi Email Kamu
                            </h2>
                            <p style="margin:0 0 32px;font-size:14px;color:#7a7d9c;text-align:center;line-height:1.7;">
                                Terima kasih sudah mendaftar di <strong style="color:#f0f1ff;">HostImgAjaa</strong>.<br/>
                                Klik tombol di bawah untuk memverifikasi email kamu.
                            </p>

                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom:32px;">
                                        <a href="${verifyUrl}"
                                           style="display:inline-block;background-color:#5c5fd6;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:12px;">
                                            Verifikasi Email Saya
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-top:1px solid #2a2d3e;padding-top:24px;">
                                        <p style="margin:0 0 8px;font-size:12px;color:#4a4d6a;text-align:center;">
                                            Atau copy link berikut ke browser kamu:
                                        </p>
                                        <p style="margin:0;font-size:11px;color:#5c5fd6;text-align:center;word-break:break-all;font-family:monospace;">
                                            ${verifyUrl}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top:24px;" align="center">
                            <p style="margin:0 0 6px;font-size:12px;color:#4a4d6a;">
                                Link ini akan kadaluarsa dalam <strong style="color:#7a7d9c;">24 jam</strong>.
                            </p>
                            <p style="margin:0;font-size:12px;color:#4a4d6a;">
                                Jika kamu tidak mendaftar, abaikan email ini.
                            </p>
                            <p style="margin:16px 0 0;font-size:11px;color:#2a2d3e;">
                                © ${new Date().getFullYear()} HostImgAjaa · Made with ❤ by Razan
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
        `,
  });
}
