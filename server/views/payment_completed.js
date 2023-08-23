let payment_template = `
    <body style="font-family: 'Poppins', sans-serif;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700&display=swap"
            rel="stylesheet">
        <div class="main_conatiner" style="padding: 2rem;">
            <h3 class="payment_status" style="margin-bottom: 1rem;">Payment Completed</h3>
            <div class="subject_text" style="margin-bottom: 0.5rem;">
                <span class="subject_heading" style="font-weight: 600;">Subject:</span>
                <span class="subject_content">
                    <span>Payment Received. Your Order No: </span><span class="order_number">__billing_id__</span> is under
                    process.
                </span>
            </div>
            <div class="content_container" style="border: 1.25px solid #000;padding-bottom: 1rem;">
                <h3 class="content_heading" style="background-color: #B72027;color: #fff;margin: 0;"><span
                        style="font-size: 2rem;padding: 0.2rem 2rem;" class="logo_text"><img
                            style="margin-top: 0.5rem;max-height: 2.1rem;" src="./assets/qwikcilver_logo.png"
                            alt="qwikcilver_logo"></span></h3>
                <div class="content_container_content" style="padding: 0.2rem 2rem;">
                    <p class="content_para1">Dear <span class="merchant_name">__merchant__</span>,</p>
                    <p class="content_para2" style="margin-bottom: 1rem;">Thanks for submitting the KYC data. Your payment
                        of Rs. <span class="payment_amount">__base_amount__</span>, towards the Order No: <span
                            class="order_number">__billing_id__</span>, has been received.</p>
                    <p class="content_para3" style="margin-bottom: 0.1rem;">Please find below the details of the
                        subscription plan that you have opted for.
                    </p>
                    <table class="plan_table" style="border-collapse: collapse;">
                        <tr style="outline: 1px solid #000;">
                            <th
                                style="outline: 1px solid #000;font-weight: normal;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                Subscription Plan Name</th>
                            <td style="outline: 1px solid #000;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;"
                                class="plan_deatils">
                                <span class="plan_name">__plan_name__</span> Plan, Rs. <span class="plan_amount">__plan_amount__</span> + GST
                            </td>
                        </tr>
                        <tr style="outline: 1px solid #000;">
                            <th
                                style="outline: 1px solid #000;font-weight: normal;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                Pro-rata amount for <span class="month_name">__month__</span>-<span
                                    class="full_year">__year__</span>:
                            </th>
                            <td style="outline: 1px solid #000;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">Rs.
                                <span class="base_amount">__baseamount__</span> (Including GST at <span
                                    class="gst_percentage">18%</span>)*</td>
                        </tr>
                        <tr style="outline: 1px solid #000;">
                            <th
                                style="outline: 1px solid #000;font-weight: normal;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                Store Credit & Gift Issuance as part Subscription</th>
                            <td style="outline: 1px solid #000;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">Rs.
                                <span class="store_credit_subscription">__given_credit__</span></td>
                        </tr>
                        <tr style="outline: 1px solid #000;">
                            <th
                                style="outline: 1px solid #000;font-weight: normal;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                Usage rate for Issuances beyond Subscription limit</th>
                            <td style="outline: 1px solid #000;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                <span class="overlimit_rate_percentage">__usage_charge__</span>%</td>
                        </tr>
                        <tr style="outline: 1px solid #000;">
                            <th
                                style="outline: 1px solid #000;font-weight: normal;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">
                                Usage limit for Issuances beyond Subscription limit</th>
                            <td style="outline: 1px solid #000;width: 70%;padding:0 0.9rem 0 0.75rem;text-align: start;">Rs.
                                <span class="overlimit_amount">__usage_limit__</span></td>
                        </tr>
                    </table>
                    <b>
                        <p class="kyc_status_text" style="margin-top: 0.1rem;margin-bottom: 1rem;">Your KYC data is
                            under-process and we will be activating your dashboard
                            soon.</p>
                    </b>
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

export default payment_template;