import axios from "axios";
import { authToken } from "../middleware/qwikcilver.js";

// set default timeout 17 sec
axios.defaults.timeout = 17500;

//Set Default retury option for the  shopify
axios.interceptors.request.use(config => {

    const { url, retry } = config;
    if(!url.includes("/admin/api")){

        config.headers = {
            ...config.headers, 
            "Content-Type": "application/json;charset=UTF-8",
            "DateAtClient": new Date().toISOString().slice(0, 22)
        }; 
    }
   if(url.includes("/app/api/fill-data")){
        config.headers = {
            ...config.headers, 
            "Content-Type": "application/vnd.manch.v1+json",
        }; 
    }
    console.log("Config", JSON.stringify(config));
    if(retry?.retries >= 0) return config;
    return {
        ...config,
        retry: {

            retries: 1,
            retryDelay: 2000
        }
    };
})

// Check api reponse and process it.
axios.interceptors.response.use((resp) => {
    console.log("Response:", JSON.stringify(resp?.data));
    return resp;
}, async (err) => {

    // Extract data from error
    const { config, response } = err;
    const { retry } = config;

   // console.log("Response Config: \n\n", JSON.stringify(config));
   // console.log("Error: \n\n", response);
    // handle auth token expiry 
    if (response?.status == "401" && response?.data?.ResponseCode == "10744") {

        const { checkAuth } = config
        const {store, n } = checkAuth;
        console.log("Check Auth: ", store, n);
        const token = await authToken(store);
        console.log("Autherisation\n\n", token)
        if(token && n){

            config.checkAuth.n -= 1;
            config.headers.Authorization = `Bearer ${token}`
            return axios(config);
        }
        return err;
    }
    
    // Check if retry mechanism exists;
    if(!retry || !retry.retries) return Promise.reject(err);

    // Abort auto retried while its not a server error or Timeout error
    if((err.code == 'ECONNABORTED')) {

        console.log("Retrying In case of Timeout -- ");
        config.retry.retries -= 1;
        //Retry while Server Error Recieved.
        await new Promise((resolve) => {
            setTimeout(() => {

                console.log("Retry Request for: ", config.url);
                resolve();
            },  retry.retryDelay || 1000);
        })
        return axios(config);
    }else{
        return Promise.reject(err);
    }
});

export default  axios;
