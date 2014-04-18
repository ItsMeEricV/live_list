class API::V1::TimersController < ApplicationController


  # GET /timers
  def index

    @timers = Timer.all
    render json: @timers

  end

  # GET /timers/1
  # GET /timers/:id
  def show

    @list = List.find(params[:id])
    render json: @list.timer

  end

  # POST /timers
  def create

    #@timer = Timer.new(name: params[:name],state: params[:state],current_timecode: params[:timecode])
    @list = List.find(params[:list_id])


    if @list.create_timer(timer_params)
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

  # PUT /timers/1
  def update

    @list = List.find(params[:id])
    @list.timer_attributes = timer_params

    if @list.save
      render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end


  end


  private

  def timer_params
    params.permit(:state,:current_timecode)
  end

end
