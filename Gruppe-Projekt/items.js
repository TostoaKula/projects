Inventory = function (){
    var self ={
    items: []
    }    
    
    self.addItems  = function(id,amount){
        for (let i = 0; i < self.items.length; i++) {
                if (self.items[i].id===id){
                    self.items[i].amount += amount;
                    return;
                }
            
        }
        self.items.push({id:id,amount:amount})
    }
    self.removeItems  = function(id,amount){for (let i = 0; i < self.items.length; i++) {
        if (self.items[i].id===id){
            self.items[i].amount -= amount;
            if (self.items[i].amount <=0)
            self.items.splice(i,1)
            return;
        }
    
    }
    }
    
    self.hasItems  = function(id,amount){
        for (let i = 0; i < self.items.length; i++) {
            if (self.items[i].id===id){
                self.items[i].amount >= amount;
                return false;
            }
    }
    
    
    self.refreshRender  = function(id,amount){}
    return self
    }}
    
    
    
    
    
    Item = function(id,name,event){
        var self ={
            id:id,
            name:name,
            event:event
        }
        return self;
    }
    
    Item("portion","portion",function(){
        player.hp = 10;
    
    });