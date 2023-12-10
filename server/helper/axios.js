import axios from "axios";

// set default timeout 17 sec
axios.defaults.timeout = 17500;

//Set Default retury option for the  shopify
axios.interceptors.request.use(config => {

    const { url, retry } = config;
    if(retry?.retries >= 0) return config;
    if(!url.includes("/admin/api")) return config;
    return {...config, retry: {
        retries: 1,
        retryDelay: 2000
    }};
})

// Check api reponse and process it.
axios.interceptors.response.use((resp) => resp, async (err) => {

    // Check timeout error
    if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {

        console.log('Request timed out');
        return Promise.reject(err);
    }
    // Extract data from error
    const { config, response} = err;
    const { retry } = config;

    // Check if retry mechanism exists;
    if(!retry || !retry.retries) return Promise.reject(err);

    // Abort auto retried while its not a server error
    if(response.status !== 500)  return Promise.reject(err);

    //Retry while Server Error Recieved.

    await new Promise((resolve) => {
        setTimeout(() => {

            console.log("Retry Request for: ", config.url);
            resolve();
        }, retry.retryDelay || 1000);
    })
    return axios(config);
});

export default axios;