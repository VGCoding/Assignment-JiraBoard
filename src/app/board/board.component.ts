import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../service/services.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  //listForm , cardForm are used for adding new list and card.
  listForm:FormGroup;
  cardForm:FormGroup;
  //used to alertuser if card/list is newly made
  alertCard:string;
  alertList:string;
  constructor(private service:ServicesService) { }
  list:any=[];
  ngOnInit(): void {
    //Both Forms with Validations
    this.listForm=new FormGroup({
    listName:new FormControl('',Validators.required)
    })
    this.cardForm=new FormGroup({
      cardHeader:new FormControl('',Validators.required),
      cardDescription:new FormControl('',Validators.required)
    })
    this.getList();
    this.sortCard();
  }
  addNewList()
  {
    //used uuid to create unique Id
   const listId= uuidv4()
   //a listObject is being made and subsequently stored in local storage using service method==>createNewList()
   let data={
    listHeader:this.listForm.value.listName,
    listId:listId,
    cards:[]
   }
  this.service.createNewList(data);
  this.listForm.reset();
  this.getList();
  //runs for 5 seconds
  this.alertList="List Added SuccesFully";
      setTimeout(
        () => this.alertList  = "",
        5000
      )
  }
  getList()
  {
  this.list=this.service.getAllList();

  }
  deleteList(list)
  {

  this.service.deleteList(list);
  this.getList()
  this.sortCard();
  }
  selectedList:any;
  listSelected(value)
  {
   this.selectedList=value;

  }
  addCard()
  {
    //this is function for new card addition through card form
    this.getList();
    let data={
      date:new Date(),
      ...this.cardForm?.value
    }
    let item=this.service.addNewCard(this.list,data,this.selectedList);
    if(item)
    {
      this.alertCard="Card Added SuccesFully";
      setTimeout(
        () => this.alertCard  = "",
        5000
      )
    }
    else if(item==null)
    {
      this.alertCard="Card Already Present";
      setTimeout(
        () => this.alertCard  = "",
        5000
      )
    }
    this.cardForm.reset();
    this.sortCard();
  }
  deleteCard(traversalList,selectedList,cardHeader)
  {
    //the service is called to
    this.list=this.service.deleteCard(traversalList,selectedList,cardHeader);
    this.sortCard();
  }
  // used for dragging in jira board
  onDragOver(event)
  {
    event.preventDefault();
  }
  onDrop(event,item)
  {
//when the object is dopped on another list we get the data in cardStorage further removed it from where it is taken
//in the newlist the card is firstly searched if it not presnt it is added otherwise it's not added
    event.preventDefault();
    const cardStorage = JSON.parse(event.dataTransfer.getData('text/plain'));
    var alredyPresent=false;
    if(item.cards.length==0){ item.cards.push(cardStorage);
      this.listUsed.cards.forEach((res,i)=>{
        if(res.cardHeader==cardStorage.cardHeader)
        {
          this.listUsed.cards.splice(i,1);
        }
      })
      this.list=this.service.saveDragAndDrop(this.list);
      this.sortCard();
    }
    else{

      item.cards.forEach(res=>{
        if(res.cardHeader==cardStorage.cardHeader)
        {
          alredyPresent=true;
          this.alertCard="Card Already Present";
          setTimeout(
            () => this.alertCard  = "",
            5000
          )
        }
      })
      if(!alredyPresent) {
      item.cards.push(cardStorage);
      this.listUsed.cards.forEach((res,i)=>{
        if(res.cardHeader==cardStorage.cardHeader)
        {
          this.listUsed.cards.splice(i,1);
        }
      })
      }
      //if the card is not present it is saved in local Storage with this call
      this.list=this.service.saveDragAndDrop(this.list);
      this.sortCard();
    }
  }
  listUsed:any;
  onDragStart(event,card,list)
  {
    //dataTransfer is used to store the card being dragged
    this.listUsed=list;
    let stringItem=JSON.stringify(card);
    event.dataTransfer.setData('text/plain', stringItem);
  }
  //used to sort the dates in reverse chronological order of their creation time.
  compareDates(a, b) {
    let date1=new Date(b.date);
    let date2 = new Date(a.date);
    return date1.getTime() - date2.getTime();
  }
  sortCard()
  {
    if(!this.list) return;
    this.list.forEach(res=>{
      if(res.cards){
        res.cards.sort(this.compareDates);
    }
    })
  }

}
