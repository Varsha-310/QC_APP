# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

bkmahapatra
// fetch card data
// const updateData = async () => {
// console.log("HIttttttttttttttttttttttttt");
// const url = `/giftcard/products/list?limit=10&page=${currentPage}`;
// const headers = {
// Authorization: getUserToken(),
// };

// try {
// const res = await instance.post(url, {}, { headers });
// const resData = await res.data;
// return resData;
// } catch (error) {
// // console.log(error);
// throw new Error(error);
// }
// };

// const queryClient = useQueryClient;

// const { isLoading, data, error } = useQuery({
// queryKey: ["giftcards"],
// queryFn: updateData,
// cacheTime: 20,
// });

// const itemIndex = inputData.findIndex((item) => item.id === itemId);
// if (newQty === "" || (newQty > 0 && newQty <= totalQty)) {

    //   if (itemIndex !== -1) {
    //     if (newQty === "") {
    //       const updatedInputData = inputData.filter(
    //         (item) => item.id !== itemId
    //       );
    //       setInputData(updatedInputData);
    //     } else {
    //       const updatedInputData = [...inputData];
    //       updatedInputData[itemIndex].qty = newQty;
    //       setInputData(updatedInputData);
    //     }
    //   } else {
    //     const newItem = { id: itemId, qty: newQty };
    //     setInputData((prev) => [...prev, newItem]);
    //   }
    // }

    // setTimeout(() => {
    //   calcRefund();
    // }, 2000);

code:"ERR_NETWORK"

<!-- plan selection  -->
 <div className="plan-selection__plan-type">
        <div className="plan-selection__plan-annually">Annually</div>
        <div className="plan-selection__plan-monthly">Monthly</div>
      </div>

<!--  -->

    try {
      const res = await instance.post(url, {}, { headers });

      if (res?.status === 200) {
        const resData = res.data;
        console.log(resData);
        // for invalid or unauthorized token
        if (resData?.code === 401) {
          throw new Error(
            "Authentication Failed: Unable to authenticate. Please log in again."
          );
        }
        if (resData?.code === 403) {
          throw new Error(
            "Session Expired: Your Session has expired. Please log in again."
          );
        }

        // for any other error
        if (resData?.code !== 200) {
          throw new Error("Network response was not OK.");
        }

        console.log(resData);
        setKycData(resData.data);
      }

      // else {
      //   throw new Error("Network response was not OK.");
      // }
    } catch (error) {
      if (!navigator.onLine) {
        console.log("No internet connection!");
      } else {
        // console.log(error);
        setIsError(error.message);
      }
    }

test push by bk27