import axios from 'axios';


const sendAxiosRequest = async (url:string, data:object) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

export default sendAxiosRequest;


//