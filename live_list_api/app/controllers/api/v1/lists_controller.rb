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
    @list = List.new(title: params[:title], active_list_item: "", timer: {state: "stopped", action_time: Time.now.to_i, duration: 0})
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

  #PATCH /lists/:id
  def update
    @list = List.find(params[:id])

    if @list.update_attributes(list_edit_params)
      render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  #DELETE /lists/:id
  def destroy
    @list = List.find(params[:id])

    if @list.destroy
      render json: @list, status: :no_content
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  private

  def list_edit_params
    params.permit(:title)
  end

end
