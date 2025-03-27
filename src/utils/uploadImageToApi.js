export async function uploadImageToApi(file) {
    const formData = new FormData();
    formData.append('image', file);
  
    const res = await fetch('http://localhost:3001/api/upload-image', {
      method: 'POST',
      body: formData,
    });    
  
    if (!res.ok) throw new Error('Erro no upload');
  
    const data = await res.json();
    return data.url;
  }
  