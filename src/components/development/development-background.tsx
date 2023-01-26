export interface Props {
  children?: any
}

export const DevelopmentBackground = ({ children }: Props) => {
  return (
    <div className="py-4 md:py-16 min-h-screen">
      <img src="/logos/angular.png" alt="" className="h-[110px] g-image-shadow top-[200px] left-[14%]" />
      <img src="/logos/graphql.png" alt="" className="h-[95px] g-image-shadow top-[260px] left-[26%]" />
      <img src="/logos/nestjs.png" alt="" className="h-[100px] g-image-shadow top-[470px] left-[20%]" />
      <img src="/logos/gcp.webp" alt="" className="h-[220px] g-image-shadow top-[480px] left-[36%]" />
      <img src="/logos/apollo.png" alt="" className="h-[130px] g-image-shadow top-[480px] left-[53%]" />
      <img src="/logos/rxjs.png" alt="" className="h-[100px] g-image-shadow top-[660px] left-[60%]" />
      <img src="/logos/nx.png" alt="" className="h-[70px] g-image-shadow top-[570px] left-[68%]" />
      <img src="/logos/tailwind.png" alt="" className="h-[110px] g-image-shadow top-[770px] left-[66%]" />
      <img src="/logos/eslint.png" alt="" className="h-[90px] g-image-shadow top-[870px] left-[77%]" />
      <img src="/logos/material.png" alt="" className="h-[90px] g-image-shadow top-[920px] left-[65%]" />
      <img src="/logos/firebase.png" alt="" className="h-[90px] g-image-shadow top-[1080px] left-[74%]" />

      {/* content */}
      {children}

      {/* <div className="absolute -z-10 scale-75 top-[67%] opacity-75 left-[-6%]">
        <Svg1 />
      </div> */}
    </div>
  )
}
