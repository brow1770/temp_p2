import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import FileInput from './zipUpload'

const inter = Inter({ subsets: ['latin'] })

/*export async function getStaticProps(context){
  const res = await fetch('http://localhost:8000/package')
const message = await res.json();

  return { 
    props: {message}
    }  ;
}*/

export default function Home({message}) {

  function handleClick() {
    alert('clicked!');
  }

  const [url, setURL] = useState('');
  /*const [packageName, setName] = useState('');
  const [packageVersion, setVersion] = useState('');*/
  const [postID, setPostID] = useState();
  const [zipData, setZipData] = useState('');
  const [postName, setPostName] = useState('');
  const [postVersion, setPostVersion] = useState('');
  const [rows, setRows] = useState([]);
  

  useEffect(() => {
    const storeRows = JSON.parse(localStorage.getItem('rows'));
    if(storeRows){
      setRows(storeRows);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rows', JSON.stringify(rows));
  }, [rows]);

  const addRow = () => {
    const newRow = { ID: postID, Name: postName, Version: postVersion };
    setRows([...rows, newRow]);
    setPostID('');
    setPostName('');
    setPostVersion('');
  };

  const handleZipUpload = (responseJSON) => {
    const addRow = {ID: responseJSON.metadata.ID, Name: responseJSON.metadata.Name, Version: responseJSON.metadata.Version};
    setRows([...rows, addRow]);
  }

  const handleFileSubmit = (base64Data) => {
    //setFileData(base64Data)
    setZipData(base64Data)
    //e.preventDefault();
    //sendPostRequest(b64String);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //const dataStruct = { packageName, packageVersion, url}; //content};
    const dataStruct = { url };
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}` + "/package", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataStruct)
    }).then(response => response.json())
      .then(responseJSON => {
        console.log(responseJSON);
        console.log(responseJSON.metadata)
        const addRow = {ID: responseJSON.metadata.ID, Name: responseJSON.metadata.Name, Version: responseJSON.metadata.Version};
        setRows([...rows, addRow]);

      }).catch(error => console.error(error));
    
    //const addRow = {ID: response.metadata.id, Name: response.metadata.id, Version: response.metadata.Version};
    //setRows([...rows, addRow]);
    //const addRow = { ID: response.}
  }

  const handleReset = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}` + "/reset", {
      method: 'DELETE',
    }).then(response => {
      if(!response.ok){
        throw new Error("Failed to reset database");
      }
      setRows([]);
    }).catch(error => console.error(error));
  }

  const handleDeleteRow = (rowID) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}` + "/package/" + String(rowID), {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      const newRows = rows.filter(row => row.ID !== rowID);
      setRows(newRows)
    })
    .catch(error => console.error(error));
  }
  /*const sendPostRequest = (b64String) => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Content: b64String})
      })
  };//response?*/

  /*function FileInput() {
    const [selectedZip, setSelectedZip] = useState(null)

  }*/
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.center}>
          <h1> Welcome to 461 Part 2! </h1>
          <p>By: Ben Brown</p>
        </div>
  {/*      <div>
          <a href="http://localhost:8000/package" target="_blank">
            <button> Sample API button </button>
          </a>
  </div>*/}
        <div>
          <button onClick={handleClick}>
            hello
          </button>
        </div>
        {/*<div>message: {message.message}</div>*/}
        <h3> Create Package From URL</h3>
        <form onSubmit={handleSubmit}>
          <label>Enter URL</label>
          <input
            type="text" 
            required
            value={url}
            onChange={(e) => setURL(e.target.value)}
            />
          <button>Submit</button>
        </form>
        <div>
          <button onClick={handleReset}>Reset Database</button>
        </div>
        <center>
          <h2>Upload Package</h2>
          <FileInput handleSubmit={handleFileSubmit} onZipUpload={handleZipUpload}/>
        </center>

        <div>
          <h1>Packages</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th> 
                <th>Version</th>
              </tr>
            </thead>
              {rows.map((row) => (
                <tr key={row.ID}>
                  <td>{row.ID}</td>
                  <td>{row.Name}</td>
                  <td>{row.Version}</td>
                  <td>
                    <button onClick={() => handleDeleteRow(row.ID)}>Delete</button>
                  </td>
                </tr>
              ))}
            <tbody>

            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}