import Banner from '../components/Banner'
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className='container flex flex-col mx-auto overflow-hidden'>
      <Banner />
      <div className='flex flex-row content-center justify-center gap-10 m-10'>
        <img src="src/assets/bike11.jpg" alt="" className='object-cover size-full h-96'/>
        <img src="src/assets/bike12.jpg" alt="" className='object-cover size-full h-96'/>
      </div>
      <div className='flex flex-col'>
        <h2 className='text-3xl text-center font-semibold p-10'>Nos Services</h2>
        <div className='flex flex-col mx-auto gap-10 mb-10 '>
          <div className='flex flex-row gap-10'>
            <img src="src/assets/bike14.jpg" alt="" className='object-cover size-42 max-w-sm'/>
            <div className='flex flex-col justify-between max-w-sm'>
              <h3 className='text-2xl'>Reparation & Manutention de Vélos à domicile</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum eum quam vero eius repellat unde fugiat iusto, optio voluptatem excepturi a id sit debitis labore praesentium impedit nulla sequi quos.</p>
              <Link to={'/schedule-appointment'}>
                <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Prendre rendez-vous</button>
              </Link>
            </div>
          </div>
          <div className='flex flex-row gap-10'>
            <img src="src/assets/bike21.jpg" alt="" className='object-cover size-42 max-w-sm'/>
            <div className='flex flex-col justify-between max-w-sm'>
              <h3 className='text-2xl'>Vente de pièces et accessoires vélos</h3>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero laudantium rerum delectus, doloribus iure pariatur alias tempore molestias veniam quas aut soluta error, eius nihil optio doloremque natus dolores expedita?</p>
              <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Acheter pièces</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 