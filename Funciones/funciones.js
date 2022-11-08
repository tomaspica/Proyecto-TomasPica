import fs from "fs";



export async function getAll(filePath) {
    try {
      const contenido = await fs.promises.readFile(filePath, "utf8");
      const elementos = JSON.parse(contenido);
      return elementos;
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.promises.writeFile(filePath, JSON.stringify([], null, 3));

        return [];
      }
      throw new Error(`${error.message}`);
    }
}

export async function save(object,filePath) {
    try {
      const elementos = await getAll(filePath);
      const id =
        elementos.length === 0 ? 1 : elementos[elementos.length - 1].id + 1;
      object.id = id;
      elementos.push(object);
      await fs.promises.writeFile(filePath, JSON.stringify(elementos, null, 3));
      return object.id;
    } catch (error) {
      throw new Error(`El archivo no pudo manipularse, error: ${error.message}`);
    }
}
export async function getById(number,filePath) {
    try {
      const elementos = await getAll(filePath);
      let elemento = elementos.find((element) => element.id == number);
      if (!elemento) {
        return null;
      }
      return { elemento };
    } catch (error) {
      throw new Error(`Error: no se encontro el producto`);
    }
}
export async function deleteById(number,filePath){
      try {
          const elementos = await getAll(filePath)
          let elemento = elementos.find((element) => element.id == number)
          if (!elemento) return 'Error: No pudo encontrarse el producto'
          const elementosFiltrados = elementos.filter((element) => element.id != number)
          await fs.promises.writeFile(filePath,JSON.stringify(elementosFiltrados,null,3))
          return elementosFiltrados
      }
      catch(error){
          throw new Error (`El archivo no pudo manipularse, error: ${error.message}`)
      }
}