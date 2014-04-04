class API::V1::ListsController < ApplicationController

  # GET /lists
  def index

    @lists = List.all
    render json: @lists


  end

  # GET /lists/1
  def show

    @list = List.find(params[:id])
    render json: @list

  end

  # POST /list
  def create

    @list = List.new(title: params[:title])
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

end
