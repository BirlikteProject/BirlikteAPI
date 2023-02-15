const category_id="63e8ebcb1f42670b82d7d8d5";
const categories = [
    { _id: '63e8ebcb1f42670b82d7d8d5', name: 'Psikolojik Destek',image_url:"" },
    { _id: '63e8ebb91f42670b82d7d8d3', name: 'Barınma',image_url:"" },
    { _id: '63e7c86d752984d395d3dcf1', name: 'İstihdam',image_url:"" },
    {_id:'63e7c856752984d395d3dcee',name:"Eğitim",image_url:""}
  ];



const  categoryResult = categories.find(category => category_id==category._id);

console.log(categoryResult.image_url)