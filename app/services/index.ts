export const getAllItems = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/GET", {
        method: "GET",
        headers: {
             "content-type": "application/json",
        },
      });
  
      const data = await res.json();
  
      return data;
    } catch (e) {
      console.log(e);
    }
  };