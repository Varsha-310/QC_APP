import axios from "axios";

export const initiatieKyc = () => {
    try {
        const transactionData = {
            method: "POST",
            url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction`,
            headers: {
                "Content-Type": application / vnd.manch.v1 + json
            }
        }
    }
    catch (err) {
        console.log(err);

    }

}

export const fillForm = () => {
    try {

    }
    catch (err) {
        console.log(err)
    }
}

export const dispatchTransaction = () => {
    try {

    }
    catch (err) {
        console.log(err)
    }
}