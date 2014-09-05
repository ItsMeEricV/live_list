LiveListApi::Application.routes.draw do
  

  root 'lists#index'

  namespace :api do
    namespace :v1 do


      resources :lists

      post 'lists/:list_id' => 'list_items#create'
      patch 'lists/:list_id/:list_item_id' => 'list_items#update'
      delete 'lists/:list_id/:list_item_id' => 'list_items#delete'
      resources :list_items

      resources :timers
    end
  end


end
