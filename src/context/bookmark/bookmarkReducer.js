import {GET_BOOKMARKS, 
        ADD_BOOKMARK, 
        ADD_CATEGORY, 
        DELETE_CATEGORY, 
        DELETE_BOOKMARK, 
        UPDATE_CATEGORY, 
        SORT_CATEGORIES, 
        FILTER_CATEGORIES,
        CLEAR_FILTER,
        ADJUST_SIZE,
        LOCAL_TO_DB,
    } from '../types'

export default (state, action) => {
    switch (action.type){
        case GET_BOOKMARKS:
            return{
                ...state,
                loading: false,
                categories: action.payload.page,
                categoryIds: action.payload.form
            }
        case ADD_CATEGORY:
            return{
                ...state,
                loading: false,
                categories: [...state.categories, action.payload.newCategory],
                categoryIds: [...state.categoryIds, action.payload.newCatIds]
            }
        case ADD_BOOKMARK:
            return{
                ...state,
                loading: false,
                categories: state.categories.map((category, i) => i === action.payload.index ? action.payload.category : category),
            }
        case UPDATE_CATEGORY:
            return{
                ...state,
                loading: false,
                categories: state.categories.map(category => category._id === action.payload._id ? action.payload : category),
                categoryIds: state.categoryIds.map(
                    (catId, i) => catId.categoryId === action.payload._id ? 
                    {categoryId: action.payload._id, categoryName: action.payload.categoryName} : (catId))
            }
        case SORT_CATEGORIES:
            return{
                ...state,
                loading: false,
                categories: action.payload

            }
        case FILTER_CATEGORIES:
            return{
                ...state,
                loading: false,
                filteredCategories: action.payload.filteredCategories,
                filteredBookmarks: action.payload.filteredBookmarks,
                filteredURLs: action.payload.filteredURLs

            }
        case CLEAR_FILTER:
            return{
                ...state,
                loading: false,
                filteredCategories: action.payload.filteredCategories,
                filteredBookmarks: action.payload.filteredBookmarks,
                filteredURLs: action.payload.filteredURLs

            }
        case DELETE_CATEGORY:
            return{
                ...state,
                categories: state.categories.filter(
                    category => (category._id ? 
                        (category._id !== action.payload) : 
                        (category.localCategoryId !== action.payload))),
                categoryIds: state.categoryIds.filter(catId => catId.categoryId !== action.payload)
            }
        case DELETE_BOOKMARK:
                return{
                 ...state,
                 categories: state.categories.map(
                     category => (category._id ? 
                        (category._id === action.payload._id ? action.payload : category
                        ) : 
                        (category.localCategoryId === action.payload.localCategoryId ? action.payload : category)))
                }
        case ADJUST_SIZE:
            return{
                ...state,
                showCat: action.payload
            }
        case LOCAL_TO_DB:
            return{
                ...state,
                categoriesToTransfer: action.payload
            }
        default:
            return state
    }
}