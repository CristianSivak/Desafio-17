class Carrito{
    constructor(){
        this.array = [];
        this.count = 0;
        this.timestamp = Date.now()
    }

    getArray(){
        return this.array
    }
    getProductById(id){
        const result = this.array.find((producto => producto.id == id))
        return result
    }

    addElement(objeto){
        this.array.push({timestamp: this.timestamp,id:this.count+1, producto:{...objeto}});
        this.count++
        return objeto
    }

    updateElement(id, newObject){
      const element = this.getProductById(id)
      const index = this.array.indexOf(element)
      this.array[index] = newObject
      console.log(this.array[index])
      return newObject
    }

    deleteElement(id){
      const element = this.getProductById(id)
      console.log(element)
      const index = this.array.indexOf(element)
      this.array.splice(index, 1)
      console.log(this.array)
      return this.array
    }

}

module.exports = new Carrito();