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

    #create new list. Setup emebedded Timer object with stopped state and 0 duration
    @list = List.new(title: params[:title], timer: {state: "stopped", action_time: Time.now.to_i, duration: 0})
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

end
