class ListsController < ApplicationController

  def index

    @lists = List.all
    render json: @lists


  end

  def create

    @list = List.new
    @list.name = "New list"
    @list.save
  end

end
