const apiUrl =
  "https://teller.viva.gr/api/modules/data.ashx?event=167bebb6-7f24-4db7-9a71-eddc456d18e7&in=true&sz=10&av-mode=false&section=2344&modules=maps&id=07639582314938786";

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((data) => {
    console.log(data);
    
    //PARSER HERE

  })
  .catch((error) => {
    console.error("Error:", error);
  });
