class API::V1::ListsController < ApplicationController

  def index

    @lists = List.all
    render json: @lists


  end

  def create

    @list = List.new(title: params[:title])
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

end
