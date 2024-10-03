import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function SizeGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#1c1c1c] text-white hover:bg-[#e87167]">Size Guide</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Size Guide</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-[#e87167] text-white p-4 rounded-md mb-4">
            <h3 className="font-bold mb-2">Note:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Measurements are in centimeters (cm)</li>
              <li>Bust measurement is taken around the fullest part of the bust</li>
              <li>Waist measurement is taken around the narrowest part of the natural waistline</li>
              <li>Hip measurement is taken around the fullest part of the hips</li>
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Size</th>
                  <th className="border border-gray-300 p-2 text-left">Bust (cm)</th>
                  <th className="border border-gray-300 p-2 text-left">Waist (cm)</th>
                  <th className="border border-gray-300 p-2 text-left">Hip (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">XXS</td>
                  <td className="border border-gray-300 p-2">78-82</td>
                  <td className="border border-gray-300 p-2">58-62</td>
                  <td className="border border-gray-300 p-2">84-88</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">S</td>
                  <td className="border border-gray-300 p-2">82-86</td>
                  <td className="border border-gray-300 p-2">62-66</td>
                  <td className="border border-gray-300 p-2">88-92</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">M</td>
                  <td className="border border-gray-300 p-2">86-90</td>
                  <td className="border border-gray-300 p-2">66-70</td>
                  <td className="border border-gray-300 p-2">92-96</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">L</td>
                  <td className="border border-gray-300 p-2">90-94</td>
                  <td className="border border-gray-300 p-2">70-74</td>
                  <td className="border border-gray-300 p-2">96-100</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">XL</td>
                  <td className="border border-gray-300 p-2">94-98</td>
                  <td className="border border-gray-300 p-2">74-78</td>
                  <td className="border border-gray-300 p-2">100-104</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}