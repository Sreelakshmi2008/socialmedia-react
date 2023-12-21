import axiosInstance from '../utils/axiosInstance';
import { baseUrl } from '../utils/constants';

const FollowUnfollowApi = async (userId, fetchData) => {
    try {

        const response = await axiosInstance.post(`${baseUrl}posts/follow/${userId}/`, {}, {
            headers: {
                Accept: 'application/json',
            },
        });
        if (response.status === 200 || response.status == 201) {
            console.log('follow/unfollow is working');
            if (fetchData) {
                fetchData();
            }
            console.log(response,"response data")
            return response.data;
            
        } else {
            console.log(response.error);
            console.log('unfollow is working');
        }

    } catch (error) {
        console.log(error);
    }
};


export default FollowUnfollowApi