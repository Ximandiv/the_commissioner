export async function deleteCommission(id, tr){
    const response = await fetch(`https://localhost:7117/Commission/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status !== 204){
        throw new Error(`HTTP error during creation! status: ${response.status}`);
    }

    console.log("Yay you removed a commission");

    tr.remove();
}