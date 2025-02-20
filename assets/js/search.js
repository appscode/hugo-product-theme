document.addEventListener("DOMContentLoaded", () => {
  let shownBlog = 0; 
  const blogList = document.querySelectorAll(".left-articles-list .single-article-card h2");
  const search = document.querySelector(".search-filter-area #search");
  const noData= document.querySelector(".no-data");

  const recommendedTopics = document.querySelectorAll(".tag");

  // Function to filter and display articles based on the query
  function filterArticles(query) {

    window.scroll({
      top: calculateTopVaue(), 
      left: 0, 
      behavior: 'smooth'
    });
    shownBlog = blogList.length
    const normalizedQuery = query.toLowerCase();

    blogList.forEach((item) => {
      const title = item.textContent.toLowerCase();
      const card = item.closest('.single-article-card');

      if (title.includes(normalizedQuery)) {
        card.style.display = "flex"; 
      } else {
        card.style.display = "none";
        shownBlog--;
      }
    });
    if(shownBlog===0)
    noData.style.display = 'flex'
    else 
    noData.style.display = 'none'
  }

  recommendedTopics.forEach((topic) => {
    topic.addEventListener("click", (e) => {
      clearPrevious(search.value)
      e.target.style.backgroundColor = '#dddddd'; 
      const query = e.target.innerText;
      search.value = query; 
      filterArticles(query); 
    });
  });


  function clearPrevious(topicName){
    recommendedTopics.forEach((topic) => {
      if(topicName === topic.innerText)
      topic.style.backgroundColor = '#f1f1f1'
    })
  }

  // Event listener for the search input
  search.addEventListener('input', (e) => {
    filterArticles(e.target.value); 
  });

  const calculateTopVaue = () =>{
      const heroArea = document.querySelector('.article-hero-area')
      const featuredArea = document.querySelector('.features-articles')
      const  headerArea = document.querySelector('header')
      if(window.innerWidth < 1023){
        let height = (heroArea ? heroArea.offsetHeight : 0) + (featuredArea ? featuredArea.offsetHeight : 0) + (headerArea ? headerArea.offsetHeight : 0) - 100;
        return height;
      }else {
        let height = (heroArea ? heroArea.offsetHeight : 0) + (featuredArea ? featuredArea.offsetHeight : 0) + (headerArea ? headerArea.offsetHeight : 0) - 116;
        return height;
      }
    }

});
