"use strict";
class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    get parent() {return this._parent();}
    //context is the owner of item (parent of inventory), on is target (character)
    usable(context,on=null) {return({OK:false, msg:'Cannot use.'});}
    use(context,on=null) {return({OK:false, msg:'Cannot use.'});}
}
//an Inventory-Component to store items
class Inventory {
    constructor(externlist) {  
        this.list = externlist ? externlist : [];
      window.storage.registerConstructor(Inventory);
    }
    get parent() {return this._parent();}
    toJSON() {return window.storage.Generic_toJSON("Inventory", this); };
    static fromJSON(value) { 
        var _x = window.storage.Generic_fromJSON(Inventory, value.data);
        return(_x);
    };
    _relinkItems() {
        for(var i=0; i<this.list.length; i++) {
            if(this.list[i].item) this.list[i].item._parent=window.gm.util.refToParent(this);
        }
    }
    postItemChange(id,operation,msg) {
        window.gm.pushLog('Inventory: '+operation+' '+id+' '+msg+'</br>');
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    findItemSlot(id) {
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) return(i);
        }
        return(-1);
    }
    getItemId(slot) {
        return(this.list[slot].id);
    }
    getItem(id) {
        var _idx = this.findItemSlot(id);
        if(_idx<0) throw new Error('no such item: '+id);
        return(this.list[_idx].item);
    }
    //returns all Ids in list
    getAllIds() {   
        var ids=[];
        for(var i=0;i<this.list.length;i++) {
            ids.push(this.list[i].id);
        }
        return(ids);
    }
    addItem(item,count=1) {
        var _i = this.findItemSlot(item.name);
        if(_i<0) {
            item._parent=window.gm.util.refToParent(this)
            this.list.push({'id': item.name,'count': count, item:item});
        }
        else this.list[_i].count+=count;
        this.postItemChange(item.name,"added","");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list[_i].count -=count;
        if(this.list[_i].count<1) this.list.splice(_i,1);
        this.postItemChange(id,"removed","");
    }
    //convience method to check if item is usable
    usable(id,on=null) {
        var _item = this.getItem(id);
        return (_item.usable(this,on));
    }
    //uses an item by calling item.use
    use(id,on=null) {
        var _item = this.getItem(id);
        var result = _item.use(this,on);
        if(result.OK) {
            this.postItemChange(id,"used",result.msg);
        }
        return(result);
    }
}