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
    console.log("Config", config);
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
axios.interceptors.response.use((resp) => resp, async (err) => {

    // Extract data from error
    const { config, response } = err;
    const { retry } = config;

    console.log("Response Config:", config);
    // handle auth token expiry 
    if (response?.status == "401" && response?.data?.ResponseCode == "10744") {

        const checkAuth = config
        const {store, n } = checkAuth;
        const token = await authToken(store);
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
    if((response.status >= 500) || (err.code === 'ECONNABORTED')) {

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