let half_limit_template = `
    <body style="font-family: 'Poppins', sans-serif;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700&display=swap"
            rel="stylesheet">
        <div class="main_conatiner" style="padding: 2rem;">
            <h3 class="half_limit_status" style="margin-bottom: 1rem;">50% Usage Exceeded</h3>
            <div class="subject_text" style="margin-bottom: 0.5rem;">
                <span class="subject_heading" style="font-weight: 600;">Subject:</span>
                <span class="subject_content">
                    <span>You have Used 50% of Usage Limit.
                    </span>
            </div>
            <div class="content_container" style="border: 1.25px solid #000;padding-bottom: 1rem;">
                <h3 class="content_heading" style="background-color: #B72027;color: #fff;margin: 0;"><span
                        style="font-size: 2rem;padding: 0.2rem 2rem;" class="logo_text"><img style="margin-top: 0.5rem;max-height: 2.1rem;"
                            src="https://uatdashboard.qwikcilver.com/public/images/qcLogo.png" alt="qwikcilver_logo"></span></h3>
                <div class="content_container_content" style="padding: 0.2rem 2rem;">
                    <p class="content_para1">Dear <span class="merchant_name">__merchant__</span>,</p>
                    <p class="content_para2 half_limit_content" style="margin-bottom: 1rem;margin-top: 1rem;">Thanks for
                        using the Qwikcilver App. This mail is
                        to alert
                        you that you
                        have exceeded 50% of the Usage Limit of Rs. <span class="overlimit_amount">__usage_limit__</span> under your
                        <b><span class="plan_name">__plan_name__</span> Subscription Plan</b>.
                    </p>
                    <p class="content_para3" style="margin-bottom: 0.1rem;">Your cumulative usage charges will be billed as part of the next month's
                        billing cycle.
                    </p>
                    <p class="half_limit_status_text" style="margin-bottom: 1rem;margin-top: 1rem;">In case you need to
                        issue more than the usage limit set for
                        you plan,
                        you can always upgrade your subscription plan.</p>
                    <p class="contact_text">If you need help or want to learn more about our Store Credits or Gift Card
                        solutions, please don't hesitate to reply to this mail or contact us at</p>
                    <a style="text-decoration: none;" class="email_link"
                        href="mailto: care@qwikcilver.com">care@qwikcilver.com</a>
                        <div class="closing_text" style="margin-top: 1rem;">Yours sincerely,</div>
                    <div class="team_name">Qwikcilver Team</div>
                </div>
            </div>
        </div>
    </body>
`
export default half_limit_template;
