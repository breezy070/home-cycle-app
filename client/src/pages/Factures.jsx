import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import { useSelector, useDispatch } from "react-redux"

export default function Factures() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [factures, setFactures] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch all factures
  useEffect(() => {
    const fetchAllFactures = async () => {
      try {
        const response = await axios.get(`/api/factures/getAllFactures/${currentUser._id}`);
        // const response = await axios.get(`/api/factures/getAllFactures/686f87a867df7377ea5bde5e`);

        console.log(response);
        setFactures(response.data.factures);
      } catch (error) {
        console.error('Error fetching factures:', error);
      }
    };

    fetchAllFactures();
  }, []);



  return (
    <div>
      <div className='flex flex-col'>
        <h2 className='text-3xl text-start font-semibold p-10'>Mes Factures</h2>
        {!factures.length ? (
            <div className="flex justify-center items-center text-center p-10">
              <p className="text-xl text-red-500">
                Aucune intervention trouvée.
              </p>
            </div>
        ) : (
        <div className='flex flex-col gap-10 p-10'>
          {factures.map((facture) => (
            <div key={facture._id}  className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
              <img src={facture.technicianImage} alt="" className='object-cover max-w-44 max-h-44 rounded-xl'/>
              <div className='flex flex-col justify-between w-full'>
                <h3 className='text-2xl'>Nom de l'Intervenant: {facture.technicianName}</h3>
                <h2 className='text-2xl'>Nom du client: {facture.userName}</h2>
                <p>Date Achat: {facture.date}</p>
                <p>Description : {facture.description}</p>
                <p>Status: {facture.status}</p>
              </div>
              <div className="flex w-full justify-end">
                  <div className="flex flex-col justify-end gap-3">
                      <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Consulter Facture</button>
                  </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
