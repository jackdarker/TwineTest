"use strict";



class Inventory {
    constructor(owner,externlist) {
        this.parent = owner;
        this.list = externlist ? externlist : [];
    }
    postItemChange(inv,id,operation,msg) {
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
        var _item = window.gm.ItemsLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (window.gm.ItemsLib[id]);
    }
    addItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) this.list.push({'id': id, 'count': count});
        else this.list[_i].count+=count;
        this.postItemChange(this,id,"added","");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list[_i].count -=count;
        if(this.list[_i].count<1) this.list.splice(_i,1);
        this.postItemChange(this,id,"removed","");
    }
    //convience method to check if item is usable
    usable(id) {
        var _item = this.getItem(id);
        return (_item.usable(this));
    }
    //uses an item by calling item.use
    use(id) {
        var _item = this.getItem(id);
        var result = _item.use(this);
        if(result.OK) {
            this.postItemChange(this,id,"used",result.msg);
        }
        return(result);
    }
}

