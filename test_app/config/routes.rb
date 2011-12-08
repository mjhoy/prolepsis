TestApp::Application.routes.draw do
  post 'projects/sort', :to => 'projects#sort', :as => :projects_sort

  resources :projects do
    resources :entries
    match 'entries/sort', :to => 'entries#sort', :as => :entries_sort
  end


  root :to => 'pages#home'
end
