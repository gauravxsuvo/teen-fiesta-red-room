import { useId } from "react";
const horizontal = "M65 216C54 143 113 111 203 133C300 155 378 194 361 246C341 306 249 304 159 280C94 263 68 250 65 216Z";
const rising = "M119 289C71 267 103 179 159 120C213 63 283 49 310 83C347 130 299 225 243 277C192 324 145 307 119 289Z";
export default function SculptureFallback() {
    const id = useId().replace(/:/g, "");
    return <svg className="sculpture-fallback" viewBox="0 0 420 420" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-chrome`} x1="94" y1="90" x2="325" y2="305" gradientUnits="userSpaceOnUse"><stop stopColor="#15151a"/><stop offset=".17" stopColor="#f4f5f7"/><stop offset=".31" stopColor="#3b3e45"/><stop offset=".44" stopColor="#08090b"/><stop offset=".57" stopColor="#d9dde4"/><stop offset=".68" stopColor="#f4f5f7"/><stop offset=".77" stopColor="#18191d"/><stop offset=".9" stopColor="#6b0b1a"/><stop offset="1" stopColor="#d4d7df"/></linearGradient>
      <linearGradient id={`${id}-red`} x1="99" y1="150" x2="299" y2="302" gradientUnits="userSpaceOnUse"><stop stopColor="#4f0714"/><stop offset=".45" stopColor="#ee1236"/><stop offset=".8" stopColor="#540614"/><stop offset="1" stopColor="#ec2340"/></linearGradient>
    </defs>
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={rising} stroke="#07080b" strokeWidth="35"/><path d={rising} stroke={`url(#${id}-chrome)`} strokeWidth="31"/><path d={rising} stroke={`url(#${id}-red)`} strokeWidth="2"/>
      <path d={horizontal} stroke="#08090b" strokeWidth="35"/><path d={horizontal} stroke={`url(#${id}-chrome)`} strokeWidth="31"/><path d={horizontal} stroke={`url(#${id}-red)`} strokeWidth="1.5"/>
      <path d="M159 120C213 63 283 49 310 83C326 104 325 132 317 159" stroke="#07080b" strokeWidth="35"/><path d="M159 120C213 63 283 49 310 83C326 104 325 132 317 159" stroke={`url(#${id}-chrome)`} strokeWidth="31"/>
      <path d="M102 267C101 240 122 204 151 170" stroke="#07080b" strokeWidth="35"/><path d="M102 267C101 240 122 204 151 170" stroke={`url(#${id}-chrome)`} strokeWidth="31"/>
      <path d="M68 233C111 269 168 286 242 289" stroke="#f41e3b" strokeOpacity=".7" strokeWidth="1.8"/>
    </g>
  </svg>;
}
