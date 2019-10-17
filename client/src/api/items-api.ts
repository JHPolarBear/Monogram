import { apiEndpoint } from '../config'
import { Item } from '../types/Item';
import { CreateItemRequest } from '../types/CreateItmeRequest';
import Axios from 'axios'
import { UpdateItemRequest } from '../types/UpdateItemRequest';
import Jimp from 'jimp'

export async function getItems(idToken: string): Promise<Item[]> {
  console.log('Fetching items')

  const response = await Axios.get(`${apiEndpoint}/items`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Items:', response.data)
  return response.data.items
}

export async function createItem(
  idToken: string,
  newItem: CreateItemRequest
): Promise<Item> {
  const response = await Axios.post(`${apiEndpoint}/items`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchItem(
  idToken: string,
  itemId: string,
  updatedItem: UpdateItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/items/${itemId}`, JSON.stringify(updatedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/items/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/items/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function filterImage(input:string): Promise<Buffer>{
  return new Promise( async resolve => {
    console.log('image read start')
    const photo = await Jimp.read(input);
    const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+photo.getExtension();
    await photo
    .resize(256, 256) // resize
    .quality(60) // set JPEG quality
    .greyscale() // set greyscale
    .getBufferAsync(photo.getExtension())
  });
}
