import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice,setTotalPrice] = useState(0)
    // const [totalQty,setTotalQty] = useState(0)
    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
 
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
    }

    //total item and total price
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)
        
    //     const tPrice = cartItem.reduce((preve,curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(tPrice)

    // },[cartItem])

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-2 justify-between'>
                                {/**logo */}
                                <div className='h-full'>
                                    <Link to={"/"} className='h-full flex justify-center items-center'>
                                        <img 
                                            src={logo}
                                            width={170}
                                            height={60}
                                            alt='logo'
                                            className='hidden lg:block'
                                        />
                                        <img 
                                            src={logo}
                                            width={120}
                                            height={60}
                                            alt='logo'
                                            className='lg:hidden'
                                        />
                                    </Link>
                                </div>

                                {/**Search */}
                                <div className='hidden lg:block flex-1 max-w-xl mx-8'>
                                    <Search/>
                                </div>


                                {/**login and my cart */}
                                <div className='flex items-center'>
                            {/* Mobile User Icon */}
                            <button 
                                className='text-gray-700 hover:text-green-600 lg:hidden mr-3 transition-colors' 
                                onClick={handleMobileUser}
                            >
                                <FaRegCircleUser size={24} />
                            </button>

                            {/* Desktop Account */}
                            <div className='hidden lg:flex items-center'>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div 
                                                onClick={() => setOpenUserMenu(prev => !prev)} 
                                                className='flex select-none items-center gap-1 cursor-pointer text-gray-700 hover:text-green-600 transition-colors'
                                            >
                                                <FaRegCircleUser size={18} />
                                                <p className='font-medium'>Account</p>
                                                {
                                                    openUserMenu ? (
                                                        <GoTriangleUp size={16} />
                                                    ) : (
                                                        <GoTriangleDown size={16} />
                                                    )
                                                }
                                            </div>
                                            {
                                                openUserMenu && (
                                                    <div className='absolute right-0 top-10'>
                                                        <div className='bg-white rounded-lg p-4 min-w-52 shadow-xl border border-gray-100'>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={redirectToLoginPage} 
                                            className='flex items-center space-x-1 font-medium text-gray-700 hover:text-green-600 transition-colors'
                                        >
                                            <FaRegCircleUser size={18} />
                                            <span>Login</span>
                                        </button>
                                    )
                                }
                            </div>

                            {/* Cart Button */}
                            <button 
                                onClick={() => setOpenCartSection(true)} 
                                className='flex items-center gap-2 ml-5 lg:ml-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 px-3 py-2 rounded-full text-white transition-all duration-300 shadow-md hover:shadow-lg'
                            >
                                <div className={cartItem.length > 0 ? 'animate-bounce' : ''}>
                                    <BsCart4 size={22} />
                                </div>
                                <div className='font-medium text-sm hidden lg:block'>
                                    {
                                        cartItem[0] ? (
                                            <div>
                                                <p>{totalQty} Items</p>
                                                <p>{DisplayPriceInRupees(totalPrice)}</p>
                                            </div>
                                        ) : (
                                            <p>My Cart</p>
                                        )
                                    }
                                </div>
                                {cartItem[0] && (
                                    <span className='lg:hidden flex items-center justify-center bg-white text-green-600 rounded-full text-xs w-5 h-5 font-bold'>
                                        {totalQty}
                                    </span>
                                )}
                            </button>
                        </div>
                </div>
            )
        }
        
        <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
        </div>

        {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
    </header>
  )
}

export default Header
