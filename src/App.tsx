import * as React from 'react'
import AppServerSide from './components/ReactTableServerSide/App'
import AppBasic from "./components/ReactTableServerSide/AppBasic";

export default function App() {
    const pageName = "React Table";
    const [collapseShow, setCollapseShow] = React.useState("hidden");
        return (
            <>
                {/* Desktop Menu */}
                <div className="nav bg-gray-900 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-64 p-4">
                    <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                        {/* Toggle */}
                        <button
                            className="cursor-pointer md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                            type="button"
                            onClick={() => setCollapseShow("bg-dark m-0 py-1 px-2")}>
                        </button>
                        {/* Brand */}
                        <div className="md:block hidden">
                            <div className="w-full flex justify-end bg-indigo">
                                {/* Menu */}
                            </div>
                        </div>
                        {/* Collapse Mobile */}
                        <div className={"bg-primary md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded md:hidden " +
                        collapseShow}>
                            {/* Collapse header */}
                            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
                                <div className="flex flex-wrap">
                                    <div className="w-full">
                                        <button
                                            type="button"
                                            className="cursor-pointer absolute top-0 right-0 -align-right md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                            onClick={() => setCollapseShow("hidden")}>
                                        </button>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        {/* Menu */}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Body */}
                <div className="bg-gray-100 relative ml-64 mr-16 bg-gray-50 ">
                    {/* TopBar */}
                    <nav className={"bg-gray-600 z-0 relative mb-4 top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start shadow-lg flex items-center p-4 "}>
                        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
                            <h2 className="text-white text-2xl uppercase lg:inline-block font-semibold">{pageName}</h2>
                        </div>
                    </nav>
                    {/* Content */}
                    <div className="px-4 mx-auto w-full">
                        {/* AppFullTable */}
                        <div className="flex flex-wrap">
                            <div className="w-full">
                                {/* Page content */}
                                <div className="flex flex-wrap">
                                    <div className="w-full rounded bg-white mb-2 p-6 break-words shadow-lg">
                                        <div className='App'>
                                            <AppServerSide />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* AppBasicTable */}
                        <div className="flex flex-wrap">
                            <div className="w-full">
                                {/* Page content */}
                                <div className="flex flex-wrap">
                                    <div className="w-full rounded bg-white mb-2 p-6 break-words shadow-lg">
                                        <div className='App'>
                                            <AppBasic />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer component */}
                        <footer className="block py-4">
                            <div className="container mx-auto px-4">
                                <hr className="mb-4 border-b-1 border-gray-300"/>
                                <div className="flex flex-wrap items-center md:justify-between justify-center">
                                    <div className="w-full md:w-4/12 px-4">
                                        <div className="text-sm text-gray-600 font-semibold py-1 text-center md:text-left">
                                            Copyright © { (new Date()).getFullYear() }
                                        </div>
                                    </div>
                                    <div className="w-full md:w-8/12 px-4">
                                        <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                                            <li>
                                                <a href="https://www.go-aos.io/" target="_blank" className="text-gray-600 hover:text-gray-800 text-sm font-semibold py-1 text-right"> AOS - Appels d'Offres Simplifiés</a>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </>
        )
    }
