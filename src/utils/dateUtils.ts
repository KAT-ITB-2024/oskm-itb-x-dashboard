
export  function calculateOverDueTime(deadline:Date | undefined, submiission:Date | undefined){
       if(deadline === undefined || submiission === undefined){
              return null;
       }

       return submiission > deadline ?
              Math.floor(
                     (submiission.getTime() - deadline.getTime())/1000
              ) : 0
}