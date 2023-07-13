let email_template = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC Completed</title>
    <link rel="stylesheet" href="./template.css">
</head>

<body>
    <div class="main_conatiner">
        <h3 class="kyc_status mb-1">KYC Completion Confirmation</h3>
        <div class="subject_text">
            <span class="subject_heading">Subject:</span>
            <span class="subject_content">
                <span>KYC Completed. Your Dashboard is Active.</span>
        </div>
        <div class="content_container">
            <h3 class="content_heading"><span class="logo_text"><img src="./assets/qwikcilver_logo.png" alt="qwikcilver_logo"></span></h3>
            <div class="content_container_content">
                <p class="content_para1">Dear <span class="merchant_name">Merchant</span>,</p>
                <p class="content_para2 mb-1">The KYC data submitted by you has been successfully processed. Your dashboard
                    for
                    <b>securely</b> issuing Store credits and Gift cards is now active.
                </p>
                <table class="plan_table">
                    <tr>
                        <th>Monthly Subscription Plan Name</th>
                        <td class="plan_deatils">
                            <span class="plan_name">Basic</span> Plan</span>, Rs. <span class="plan_amount">399</span> + GST
                        </td>
                    </tr>
                    <tr>
                        <th>Store Credit & Gift Issuance as part Subscription</th>
                        <td>Rs. <span class="store_credit_subscription">20,000</span></td>
                    </tr>
                    <tr>
                        <th>Usage rate for Issuances beyond Subscription limit</th>
                        <td><span class="overlimit_rate_percentage">2.5</span>%</td>
                    </tr>
                    <tr>
                        <th>Usage limit for Issuances beyond Subscription limit</th>
                        <td>Rs. <span class="overlimit_amount">100,000</span></td>
                    </tr>
                </table>
                <b>
                    <p class="kyc_dashboard_link_text">Please login to your “Qwikcilver - Store Credits & Gift Cards”
                        dashboard using
                        this <a href="#">link</a></p>
                </b>
                <p class="contact_text">If you need help or want to learn more about our Store Credits or Gift Card
                    solutions, please don't hesitate to reply to this mail or contact us at</p>
                <a href="mailto: care@qwikcilver.com">care@qwikcilver.com</a>
                <div class="closing_text">Yours sincerely,</div>
                <div class="team_name">Qwikcilver Team</div>
                <p class="note_text">
                    <span class="note_heading">* Note:</span> This means if you issue Rs. 100 worth of Store credit or Gift card, the usage charges
                    for you will be Rs. 2.5.
                </p>
            </div>
        </div>
    </div>
</body>

</html>`

export default email_template;