exports.template = `
    <body style="font-family: 'Poppins', sans-serif;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700&display=swap"
            rel="stylesheet">
        <div class="main_conatiner" style="padding: 2rem;">
            <h3 class="limit_status" style="margin-bottom: 1rem;">Plan Limit Exceeded</h3>
            <div class="subject_text" style="margin-bottom: 0.5rem;">
                <span class="subject_heading" style="font-weight: 600;">Subject:</span>
                <span class="subject_content">
                    You have Exceeded your Subscription Plan Limit.
                </span>
            </div>
            <div class="content_container" style="border: 1.25px solid #000;padding-bottom: 1rem;">
                <h3 class="content_heading" style="background-color: #B72027;color: #fff;margin: 0;"><span
                        style="font-size: 2rem;padding: 0.2rem 2rem;" class="logo_text"><img
                            style="margin-top: 0.5rem;max-height: 2.1rem;" src="./assets/qwikcilver_logo.png"
                            alt="qwikcilver_logo"></span></h3>
                <div class="content_container_content" style="padding: 0.2rem 2rem;">
                    <p class="content_para1">Dear <span class="merchant_name">Merchant</span>,</p>
                    <p class="content_para2" style="margin-bottom: 1rem;">Thanks for using the Qwikcilver App. This mail is
                        to alert you that you
                        have exceeded the plan issuance limit of Rs. <span class="store_credit_subscription">20,000</span>
                        under your <b><span class="plan_name">Basic</span> Subscription Plan</b>.</p>
                    <p class="content_para3" style="margin-bottom: 0.1rem;">Now onwards, all the store credit & gift card
                        issuances from the
                        Qwikcilver App will be charged at a flat rate of <span class="overlimit_rate_percentage">2.5</span>%
                        *per issuance. You
                        will be able to securely issue Rs. <span class="overlimit_amount">100,000</span> worth of Store
                        Credits and Gift
                        Cards at the above rate.
                    </p>
                    <p class="cumulative_usage_text" style="margin-bottom: 1rem;margin-top: 1rem;">Your cumulative usage
                        charges will be billed as part of the
                        next
                        month's billing cycle.</p>
                    <p class="contact_text">If you need help or want to learn more about our Store Credits or Gift Card
                        solutions, please don't hesitate to reply to this mail or contact us at</p>
                    <a style="text-decoration: none;" class="email_link"
                        href="mailto: care@qwikcilver.com">care@qwikcilver.com</a>
                    <div class="closing_text" style="margin-top: 1rem;">Yours sincerely,</div>
                    <div class="team_name">Qwikcilver Team</div>
                    <p class="note_text" style="margin-top: 0.95rem;">
                        <span class="note_heading" style="font-weight: 600;">* Note:</span> This means if you issue Rs. 100
                        worth of Store credit or
                        Gift card, the usage charges
                        for you will be Rs. 2.5.
                    </p>
                </div>
            </div>
        </div>
    </body>`