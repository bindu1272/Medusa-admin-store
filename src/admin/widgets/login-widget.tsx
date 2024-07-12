import type { WidgetConfig,ProductDetailsWidgetProps } from "@medusajs/admin"
import { useNavigate } from "react-router-dom"
import StoreCreation from "../components/createstore-flow/storeCreation"




const ProductWidget = ({notify}:ProductDetailsWidgetProps) => {
  const navigate = useNavigate()

//   const createStore=()=>{
//     notify.success("success", "You clicked the button!")
//     navigate("/store")
//   }
  return (
    <>
    {/* <div className="bg-white p-8 border border-gray-200 rounded-lg"> */}
    {/* <button 
      className="bg-black rounded p-1 text-white"
      onClick={createStore}
    >
      Create Store
    </button> */}
    {/* </div> */}
    <div>
    <StoreCreation/>
    </div>
    </>
  )
}

export const config: WidgetConfig = {
  zone: "login.after",
}

export default ProductWidget