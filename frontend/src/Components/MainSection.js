import React, { useCallback, useContext, useEffect,  useRef,  useState } from 'react'
import { AppContext } from '../ContextAndSocket/ContextApi';
import Card from './Card';
import { toast } from 'react-toastify';
import Comment from './CommentAndLike/Comment';
import Loader from './Loader';
import Like from './CommentAndLike/Like';




export default function MainSection() {

       const {loading,backendCall} = useContext(AppContext);
       const [feedPost ,setFeedPost] = useState([]);
       const {showFeed,selectOnPost,setShowFeed,showComment,setShowComment,likePageShow} = useContext(AppContext);
      
       const [storeComment,setCurrComment] = useState(null);

      //  check kro aur post baki hai 

      const [hasMorePost ,setMorePost] = useState(true);

      // gar user infinte scroll kre tab

      const [isFetchingMore,setIsfetchingMore] = useState(false);

       const [page,setPage] = useState(1);
       
    
        useEffect(()=>{
         fetchData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
        },[page]);

     
    
        async function fetchData(){   
          //  backend call gai aur data khatam ho gya waps jao 
            if( !hasMorePost){
                 return ;
            };

            setIsfetchingMore(true);
            
              try{
                  const res = await backendCall({data:null,path:`/posts?page=${page}&limit=7`,method:"get"});    
                   
                  if(res?.isError){
                      toast.warn(res.message);
                  }
                  if(res.success){
                    let newPost = res?.data?.posts ;

                    if(newPost.length === 0){
                         setMorePost(false);
                    }else{
                           toast.success(res?.data?.message);
                        setFeedPost((prevPosts)=>[...prevPosts,...newPost]);
                    }
                       
                  }
            }catch(err){
                 console.error(err);
                
            }finally{
                setIsfetchingMore(false);

               
            }
        };
    
        // track krne ke liye --->
        const observer = useRef(null);

      const lastElementObesever = useCallback((node)=>{
                    if(isFetchingMore || loading ){
                          return ;
                    };

               if( observer.current){
                    observer.current.disconnect();
               } ;
                 
              //  new observer bnao 

               observer.current = new IntersectionObserver( enteries =>{
                  if(enteries[0].isIntersecting && hasMorePost){
                          setPage((prev)=>(prev+1));
                  };

              },{threshold:1.0}
                   
              );

              if(node) {
                  observer.current.observe(node);
              }
      }, [isFetchingMore, hasMorePost, loading]);

    
   
     if(loading && feedPost.length===0){
       return <Loader/>
     }
  
   

  return (
    <div className='relative h-full min-h-0 overflow-hidden'>
    <div className={`h-full w-full min-h-0  ${showComment ? "overflow-hidden" : "overflow-y-auto"} scroll-smooth`} >
       
            {
              showFeed && ( feedPost.length === 0 ? (<p className=' text-center '>No post found</p>) :(
                <>
               {feedPost.map((post, index) => {
                           
                            if (feedPost.length === index + 1) {
                                return (
                                 <div key={post._id} ref={lastElementObesever}>
                                <Card post={post} setCommentStatus={setShowComment} setStoreComment={setCurrComment} />
                                </div>
                                   )
                                  } else {
                                             return (
                                           <div key={post._id}>
                                     <Card post={post} setCommentStatus={setShowComment} setStoreComment={setCurrComment} />
                                        </div>
                                        )
                            
                                  }})}
                        

                        {/* Pagination Loader (Pehli call ke alawa jo baaki calls hongi unka loader) */}
                        {isFetchingMore && <div className="text-center py-4"><Loader /></div>}

                        {!hasMorePost && feedPost.length > 0 && (
                            <p className='text-center text-gray-500 py-5'>You have seen all posts! 🎉</p>
                        )}
                 </>
              ))
            }
            
          
            {
             !showComment  &&  selectOnPost && (<div className="h-full m-2 "> <button onClick={()=>{setShowFeed(true)}} className="border-2 p-2 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer text-white">Back to Feed</button> <Card post={selectOnPost} setCommentStatus={setShowComment} setStoreComment={setCurrComment} /> </div>)
            }
             
            
         </div>   
           {
            showComment && (
                <div className=" absolute inset-0 z-50 flex flex-col h-full w-full bg-white shadow-2xl overflow-y-auto sm:rounded-t-2xl animate-fade-in mt-1">
                          <Comment postComment={storeComment}/>
                            </div>
                       )
                }

                {
                  likePageShow &&  <div className=" absolute inset-0 z-50 flex flex-col h-full w-full bg-white shadow-2xl overflow-y-auto sm:rounded-t-2xl animate-fade-in mt-1">
                          <Like/>
                            </div>
                }
    </div>
  )
 }
