import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  //using local storage to store data ,so that data stays after refreshing
  list:any=[];
  constructor() {  }
  createNewList(data)
  {
    //used to get data from local storage , and new list is pushed into it and is stored later on.
    this.list=this.getAllList();
    if(this.list==null) this.list=[];
    this.list.push(data);
    //as data in localstorage is used to store string data it is converted to string using json.stringify()
    //converted back to object using json.parse()
    localStorage.setItem("list",JSON.stringify(this.list));
    let getList =localStorage.getItem("list");
    return JSON.parse(getList);
  }

  getAllList()
  {
    let getList=localStorage.getItem("list");
    return JSON.parse(getList);
  }
  deleteList(data)
  {
   //deleting the list and card data in it
    let getList=JSON.parse(localStorage.getItem("list"));

    getList.forEach((res,i)=>{
      if(res?.listId==data?.listId)
      {
        getList.splice(i,1);
      }
    })

    localStorage.setItem("list",JSON.stringify(getList));
  }
  addNewCard(lists,newCard,selectedList)
  {
    //firstly looking for the selected lists from lists tham looking if cardheader already exisits if it does
    //card is not added else it is added
    var cardAlreadyExists=false;
      lists.forEach((res)=>{
      if(res.listHeader==selectedList.listHeader)
      {
        res.cards.forEach(data=>{
        if(data.cardHeader==newCard.cardHeader)
        {
          cardAlreadyExists=true;
        }
        })
        if(cardAlreadyExists)
        {
          return;
        }
        res.cards.push(newCard);
      }
    })
    if(cardAlreadyExists) return null;
    localStorage.setItem("list",JSON.stringify(lists));
    let getList=localStorage.getItem("list");
    return JSON.parse(getList);
  }
  deleteCard(list,item,cardHeader)
  {
   //going through all list to list with card , finding card and removing it with splice
    list.forEach(res=>{
      if(res.listId==item.listId)
      {
        res.cards.forEach((data,i)=>{
          if(data.cardHeader==cardHeader)
          {
            res.cards.splice(i,1);
          }
        })
      }
    })
    localStorage.setItem("list",JSON.stringify(list));
    let getList=localStorage.getItem("list");
    return JSON.parse(getList);
  }
  saveDragAndDrop(newList)
  {
    //used to save list after drag and drop.
    localStorage.setItem("list",JSON.stringify(newList));
    let getList =localStorage.getItem("list");
    return JSON.parse(getList);
  }
}
